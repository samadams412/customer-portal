'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order } from '@/types/interface' // or your generated Prisma type

export const OrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('orderDate') as string)
      return <span>{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: 'totalAmount',
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = row.getValue('totalAmount') as number
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'deliveryType',
    header: 'Delivery',
    cell: ({ row }) => (
      <span className="capitalize">{String(row.getValue('deliveryType')).toLowerCase()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const colorMap: Record<string, string> = {
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        success: 'text-green-600',
        failed: 'text-red-600',
      }
      return <span className={colorMap[status] || ''}>{status}</span>
    },
  },
]
