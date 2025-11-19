import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Get parameters from URL
  const title = searchParams.get('title') || 'Navigator AI'
  const description =
    searchParams.get('description') ||
    'Turn Every Referral into a Scheduled, In-Network Appointment.'
  const type = searchParams.get('type') || 'default' // default, blog, article

  // Define gradient based on type
  const gradients = {
    default: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
    blog: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
    article: 'linear-gradient(to bottom right, #0c4a6e, #0f172a)'
  }

  const gradient = gradients[type as keyof typeof gradients] || gradients.default

  return new ImageResponse(
    <div
      style={{
        background: gradient,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '60px 80px',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* Logo/Brand */}
      <div
        style={{
          fontSize: 24,
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
            marginRight: 16,
            display: 'flex'
          }}
        />
        Navigator AI
      </div>

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          maxWidth: '100%'
        }}
      >
        <div
          style={{
            fontSize: title.length > 50 ? 48 : 64,
            fontWeight: 'bold',
            lineHeight: 1.2,
            display: 'flex',
            flexWrap: 'wrap',
            color: 'white',
            maxWidth: '100%'
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              display: 'flex',
              lineHeight: 1.4
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Footer Tags */}
      <div
        style={{
          fontSize: 20,
          color: '#64748b',
          display: 'flex'
        }}
      >
        Navigator AI
      </div>
    </div>,
    {
      width: 1200,
      height: 630
    }
  )
}
