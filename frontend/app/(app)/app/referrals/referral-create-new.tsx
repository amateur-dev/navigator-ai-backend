'use client'

import { Plus, Upload } from 'lucide-react'
import { useQueryState } from 'nuqs'
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui'
import { ReferralFileUpload } from './referral-file-upload'

export const ReferralCreateNew = () => {
  const [action, setAction] = useQueryState('action')

  return (
    <Drawer
      open={action === 'create-referral'}
      onOpenChange={(open) => setAction(open ? 'create-referral' : null)}
    >
      <DrawerTrigger asChild>
        <Button variant="default" className="h-10" onClick={() => setAction('create-referral')}>
          <span>New Referral</span>
          <Plus className="size-4" strokeWidth={1.8} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen px-10 pb-6">
        <DrawerHeader className="items-start gap-0!">
          <DrawerTitle>Create New Referral</DrawerTitle>
          <DrawerDescription>Upload patient's referral document to get started</DrawerDescription>
        </DrawerHeader>
        <ReferralFileUpload />
        <DrawerFooter className="grid grid-cols-2 gap-2">
          <DrawerClose asChild>
            <Button variant="outline" className="h-13" onClick={() => setAction(null)}>
              Cancel
            </Button>
          </DrawerClose>
          <Button className="h-13">
            <Upload className="size-5 mr-1" strokeWidth={1.8} />
            <span>Process Referral</span>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
