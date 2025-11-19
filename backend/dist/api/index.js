import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { MOCK_UPLOAD_RESPONSE, MOCK_ORCHESTRATION_RESPONSE, MOCK_REFERRALS_LIST, MOCK_REFERRAL_DETAILS, MOCK_REFERRAL_LOGS } from './mockData';
// Create Hono app with middleware
const app = new Hono();
// Add request logging middleware
app.use('*', logger());
// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// === Navigator-AI Backend Endpoints ===
// Ping endpoint
app.get('/ping', (c) => {
    return c.text('pong');
});
// File upload endpoint
app.post('/upload', async (c) => {
    try {
        const formData = await c.req.formData();
        const file = formData.get('file');
        if (!file) {
            return c.text('No file uploaded', 400);
        }
        // Upload to SmartBucket (referral-docs)
        const smartbucket = c.env.REFERRAL_DOCS;
        const arrayBuffer = await file.arrayBuffer();
        await smartbucket.put(file.name, new Uint8Array(arrayBuffer), {
            httpMetadata: {
                contentType: file.type || 'application/pdf',
            },
            customMetadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString()
            }
        });
        return c.json(MOCK_UPLOAD_RESPONSE);
    }
    catch (error) {
        console.error('Upload error:', error);
        return c.json({
            success: false,
            error: {
                code: "UPLOAD_FAILED",
                message: "Failed to process document",
                statusCode: 500
            }
        }, 500);
    }
});
// AI Extraction endpoint (mocked for now)
app.post('/extract', async (c) => {
    try {
        const body = await c.req.json();
        const { filename } = body;
        if (!filename) {
            return c.text('Filename is required', 400);
        }
        // Mock AI extraction
        const extractedData = {
            patientName: 'John Doe',
            dateOfBirth: '1980-01-01',
            referralReason: 'Cardiology consultation',
            insuranceProvider: 'BlueCross',
        };
        return c.json(extractedData);
    }
    catch (error) {
        console.error('Extract error:', error);
        return c.text('Extraction failed', 500);
    }
});
// Workflow Orchestration endpoint
app.post('/orchestrate', async (c) => {
    try {
        const body = await c.req.json();
        // In a real app, we would use the body data to trigger the workflow
        // const { documentId, referralData } = body;
        return c.json(MOCK_ORCHESTRATION_RESPONSE);
    }
    catch (error) {
        console.error('Orchestrate error:', error);
        return c.json({
            success: false,
            error: {
                code: "ORCHESTRATION_FAILED",
                message: "Failed to start orchestration",
                statusCode: 500
            }
        }, 500);
    }
});
// Get all referrals
app.get('/referrals', (c) => {
    return c.json(MOCK_REFERRALS_LIST);
});
// Get referral details
app.get('/referral/:id', (c) => {
    const id = c.req.param('id');
    if (id === 'ref-001') {
        return c.json(MOCK_REFERRAL_DETAILS);
    }
    return c.json({
        success: false,
        error: {
            code: "REFERRAL_NOT_FOUND",
            message: `Referral with ID '${id}' not found`,
            statusCode: 404
        }
    }, 404);
});
// Get referral logs
app.get('/referral/:id/logs', (c) => {
    const id = c.req.param('id');
    if (id === 'ref-001') {
        return c.json(MOCK_REFERRAL_LOGS);
    }
    return c.json({
        success: false,
        error: {
            code: "REFERRAL_NOT_FOUND",
            message: `Referral with ID '${id}' not found`,
            statusCode: 404
        }
    }, 404);
});
// Patient Confirmation endpoint
app.post('/confirm', async (c) => {
    try {
        const body = await c.req.json();
        const { patientName, slot } = body;
        if (!patientName || !slot) {
            return c.text('Missing required fields', 400);
        }
        // Mock SMS/Email dispatch
        console.log(`Sending confirmation to ${patientName} for slot ${slot}`);
        return c.json({
            message: 'Confirmation sent successfully',
            status: 'Sent',
        });
    }
    catch (error) {
        console.error('Confirm error:', error);
        return c.text('Confirmation failed', 500);
    }
});
// === Basic API Routes ===
app.get('/api/hello', (c) => {
    return c.json({ message: 'Hello from Hono!' });
});
app.get('/api/hello/:name', (c) => {
    const name = c.req.param('name');
    return c.json({ message: `Hello, ${name}!` });
});
// Example POST endpoint
app.post('/api/echo', async (c) => {
    const body = await c.req.json();
    return c.json({ received: body });
});
// === RPC Examples: Service calling Actor ===
// Example: Call an actor method
/*
app.post('/api/actor-call', async (c) => {
  try {
    const { message, actorName } = await c.req.json();

    if (!actorName) {
      return c.json({ error: 'actorName is required' }, 400);
    }

    // Get actor namespace and create actor instance
    // Note: Replace MY_ACTOR with your actual actor binding name
    const actorNamespace = c.env.MY_ACTOR; // This would be bound in raindrop.manifest
    const actorId = actorNamespace.idFromName(actorName);
    const actor = actorNamespace.get(actorId);

    // Call actor method (assuming actor has a 'processMessage' method)
    const response = await actor.processMessage(message);

    return c.json({
      success: true,
      actorName,
      response
    });
  } catch (error) {
    return c.json({
      error: 'Failed to call actor',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Get actor state
/*
app.get('/api/actor-state/:actorName', async (c) => {
  try {
    const actorName = c.req.param('actorName');

    // Get actor instance
    const actorNamespace = c.env.MY_ACTOR;
    const actorId = actorNamespace.idFromName(actorName);
    const actor = actorNamespace.get(actorId);

    // Get actor state (assuming actor has a 'getState' method)
    const state = await actor.getState();

    return c.json({
      success: true,
      actorName,
      state
    });
  } catch (error) {
    return c.json({
      error: 'Failed to get actor state',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// === SmartBucket Examples ===
// Example: Upload file to SmartBucket
/*
app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Upload to SmartBucket (Replace MY_SMARTBUCKET with your binding name)
    const smartbucket = c.env.MY_SMARTBUCKET;
    const arrayBuffer = await file.arrayBuffer();

    const putOptions: BucketPutOptions = {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        size: file.size.toString(),
        description: description || '',
        uploadedAt: new Date().toISOString()
      }
    };

    const result = await smartbucket.put(file.name, new Uint8Array(arrayBuffer), putOptions);

    return c.json({
      success: true,
      message: 'File uploaded successfully',
      key: result.key,
      size: result.size,
      etag: result.etag
    });
  } catch (error) {
    return c.json({
      error: 'Failed to upload file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Get file from SmartBucket
/*
app.get('/api/file/:filename', async (c) => {
  try {
    const filename = c.req.param('filename');

    // Get file from SmartBucket
    const smartbucket = c.env.MY_SMARTBUCKET;
    const file = await smartbucket.get(filename);

    if (!file) {
      return c.json({ error: 'File not found' }, 404);
    }

    return new Response(file.body, {
      headers: {
        'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Object-Size': file.size.toString(),
        'X-Object-ETag': file.etag,
        'X-Object-Uploaded': file.uploaded.toISOString(),
      }
    });
  } catch (error) {
    return c.json({
      error: 'Failed to retrieve file',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Search SmartBucket documents
/*
app.post('/api/search', async (c) => {
  try {
    const { query, page = 1, pageSize = 10 } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;

    // For initial search
    if (page === 1) {
      const requestId = `search-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const results = await smartbucket.search({
        input: query,
        requestId
      });

      return c.json({
        success: true,
        message: 'Search completed',
        query,
        results: results.results,
        pagination: {
          ...results.pagination,
          requestId
        }
      });
    } else {
      // For paginated results
      const { requestId } = await c.req.json();
      if (!requestId) {
        return c.json({ error: 'Request ID required for pagination' }, 400);
      }

      const paginatedResults = await smartbucket.getPaginatedResults({
        requestId,
        page,
        pageSize
      });

      return c.json({
        success: true,
        message: 'Paginated results',
        query,
        results: paginatedResults.results,
        pagination: paginatedResults.pagination
      });
    }
  } catch (error) {
    return c.json({
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Chunk search for finding specific sections
/*
app.post('/api/chunk-search', async (c) => {
  try {
    const { query } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Query is required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;
    const requestId = `chunk-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const results = await smartbucket.chunkSearch({
      input: query,
      requestId
    });

    return c.json({
      success: true,
      message: 'Chunk search completed',
      query,
      results: results.results
    });
  } catch (error) {
    return c.json({
      error: 'Chunk search failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Document chat/Q&A
/*
app.post('/api/document-chat', async (c) => {
  try {
    const { objectId, query } = await c.req.json();

    if (!objectId || !query) {
      return c.json({ error: 'objectId and query are required' }, 400);
    }

    const smartbucket = c.env.MY_SMARTBUCKET;
    const requestId = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const response = await smartbucket.documentChat({
      objectId,
      input: query,
      requestId
    });

    return c.json({
      success: true,
      message: 'Document chat completed',
      objectId,
      query,
      answer: response.answer
    });
  } catch (error) {
    return c.json({
      error: 'Document chat failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: List objects in bucket
/*
app.get('/api/list', async (c) => {
  try {
    const url = new URL(c.req.url);
    const prefix = url.searchParams.get('prefix') || undefined;
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined;

    const smartbucket = c.env.MY_SMARTBUCKET;

    const listOptions: BucketListOptions = {
      prefix,
      limit
    };

    const result = await smartbucket.list(listOptions);

    return c.json({
      success: true,
      objects: result.objects.map(obj => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        etag: obj.etag
      })),
      truncated: result.truncated,
      cursor: result.truncated ? result.cursor : undefined
    });
  } catch (error) {
    return c.json({
      error: 'List failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// === KV Cache Examples ===
// Example: Store data in KV cache
/*
app.post('/api/cache', async (c) => {
  try {
    const { key, value, ttl } = await c.req.json();

    if (!key || value === undefined) {
      return c.json({ error: 'key and value are required' }, 400);
    }

    const cache = c.env.MY_CACHE;

    const putOptions: KvCachePutOptions = {};
    if (ttl) {
      putOptions.expirationTtl = ttl;
    }

    await cache.put(key, JSON.stringify(value), putOptions);

    return c.json({
      success: true,
      message: 'Data cached successfully',
      key
    });
  } catch (error) {
    return c.json({
      error: 'Cache put failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// Example: Get data from KV cache
/*
app.get('/api/cache/:key', async (c) => {
  try {
    const key = c.req.param('key');

    const cache = c.env.MY_CACHE;

    const getOptions: KvCacheGetOptions<'json'> = {
      type: 'json'
    };

    const value = await cache.get(key, getOptions);

    if (value === null) {
      return c.json({ error: 'Key not found in cache' }, 404);
    }

    return c.json({
      success: true,
      key,
      value
    });
  } catch (error) {
    return c.json({
      error: 'Cache get failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// === Queue Examples ===
// Example: Send message to queue
/*
app.post('/api/queue/send', async (c) => {
  try {
    const { message, delaySeconds } = await c.req.json();

    if (!message) {
      return c.json({ error: 'message is required' }, 400);
    }

    const queue = c.env.MY_QUEUE;

    const sendOptions: QueueSendOptions = {};
    if (delaySeconds) {
      sendOptions.delaySeconds = delaySeconds;
    }

    await queue.send(message, sendOptions);

    return c.json({
      success: true,
      message: 'Message sent to queue'
    });
  } catch (error) {
    return c.json({
      error: 'Queue send failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
*/
// === Environment Variable Examples ===
app.get('/api/config', (c) => {
    return c.json({
        hasEnv: !!c.env,
        availableBindings: {
        // These would be true if the resources are bound in raindrop.manifest
        // MY_ACTOR: !!c.env.MY_ACTOR,
        // MY_SMARTBUCKET: !!c.env.MY_SMARTBUCKET,
        // MY_CACHE: !!c.env.MY_CACHE,
        // MY_QUEUE: !!c.env.MY_QUEUE,
        },
        // Example access to environment variables:
        // MY_SECRET_VAR: c.env.MY_SECRET_VAR // This would be undefined if not set
    });
});
export default class extends Service {
    async fetch(request) {
        return app.fetch(request, this.env);
    }
}
