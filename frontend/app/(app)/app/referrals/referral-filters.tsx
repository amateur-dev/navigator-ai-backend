'use client'

import { Calendar, Filter, X } from 'lucide-react'
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs'
import * as React from 'react'
import {
  Badge,
  Button,
  Checkbox,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator
} from '@/components/ui'

// Predefined filter options
const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'ENT',
  'Gastroenterology',
  'Nephrology',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Psychiatry',
  'Pulmonology',
  'Rheumatology',
  'Urology'
]

const PAYERS = [
  'Aetna',
  'Anthem',
  'Blue Cross Blue Shield',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Medicaid',
  'Medicare',
  'UnitedHealthcare'
]

const STATUSES = ['Pending', 'Scheduled', 'Completed', 'Cancelled']

const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'allTime', label: 'All Time' }
]

export function ReferralFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      specialty: parseAsArrayOf(parseAsString).withDefault([]),
      payer: parseAsArrayOf(parseAsString).withDefault([]),
      status: parseAsArrayOf(parseAsString).withDefault([]),
      dateRange: parseAsString.withDefault('allTime')
    },
    {
      history: 'push'
    }
  )

  const activeFilterCount =
    filters.specialty.length +
    filters.payer.length +
    filters.status.length +
    (filters.dateRange !== 'allTime' ? 1 : 0)

  const handleClearAll = () => {
    setFilters({
      specialty: [],
      payer: [],
      status: [],
      dateRange: 'allTime'
    })
  }

  const toggleSpecialty = (value: string) => {
    const newSpecialties = filters.specialty.includes(value)
      ? filters.specialty.filter((s) => s !== value)
      : [...filters.specialty, value]
    setFilters({ specialty: newSpecialties })
  }

  const togglePayer = (value: string) => {
    const newPayers = filters.payer.includes(value)
      ? filters.payer.filter((p) => p !== value)
      : [...filters.payer, value]
    setFilters({ payer: newPayers })
  }

  const toggleStatus = (value: string) => {
    const newStatuses = filters.status.includes(value)
      ? filters.status.filter((s) => s !== value)
      : [...filters.status, value]
    setFilters({ status: newStatuses })
  }

  return (
    <div className="flex items-center gap-1">
      {/* Specialty Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="size-3" strokeWidth={2} />
            <span className="text-sm">Specialty</span>
            {filters.specialty.length > 0 && (
              <React.Fragment>
                <Separator orientation="vertical" className="mr-0.5 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 w-5 font-normal">
                  {filters.specialty.length}
                </Badge>
              </React.Fragment>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0 flex flex-col" align="start">
          <div className="font-medium text-sm px-4 pt-3 pb-2 border-b">Specialty</div>
          <ScrollArea className="h-[260px]">
            <div className="grid pt-1 pb-3">
              {SPECIALTIES.map((specialty) => (
                <div
                  key={specialty}
                  className="flex items-center space-x-2 hover:bg-accent px-4 py-2 relative"
                >
                  <Checkbox
                    id={`specialty-${specialty}`}
                    checked={filters.specialty.includes(specialty)}
                    onCheckedChange={() => toggleSpecialty(specialty)}
                    className="absolute left-4 inset-y-0 my-auto"
                  />
                  <Label
                    htmlFor={`specialty-${specialty}`}
                    className="text-sm font-normal cursor-pointer flex-1 pl-6"
                  >
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Payer Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="size-3" strokeWidth={2} />
            <span className="text-sm">Payer</span>
            {filters.payer.length > 0 && (
              <React.Fragment>
                <Separator orientation="vertical" className="mr-0.5 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 w-5 font-normal">
                  {filters.payer.length}
                </Badge>
              </React.Fragment>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0 flex flex-col" align="start">
          <div className="font-medium text-sm px-4 pt-3 pb-2 border-b">Payer</div>
          <ScrollArea className="h-[260px]">
            <div className="grid pt-1 pb-3">
              {PAYERS.map((payer) => (
                <div
                  key={payer}
                  className="flex items-center space-x-2 hover:bg-accent px-4 py-2 relative"
                >
                  <Checkbox
                    id={`payer-${payer}`}
                    checked={filters.payer.includes(payer)}
                    onCheckedChange={() => togglePayer(payer)}
                    className="absolute left-4 inset-y-0 my-auto"
                  />
                  <Label
                    htmlFor={`payer-${payer}`}
                    className="text-sm font-normal cursor-pointer flex-1 pl-6"
                  >
                    {payer}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="size-3" strokeWidth={2} />
            <span className="text-sm">Status</span>
            {filters.status.length > 0 && (
              <React.Fragment>
                <Separator orientation="vertical" className="mr-0.5 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 w-5 font-normal">
                  {filters.status.length}
                </Badge>
              </React.Fragment>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0 flex flex-col" align="start">
          <div className="font-medium text-sm px-4 pt-3 pb-2 border-b">Status</div>
          <div className="grid pt-1 pb-3">
            {STATUSES.map((status) => (
              <div
                key={status}
                className="flex items-center space-x-2 hover:bg-accent px-4 py-2 relative"
              >
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                  className="absolute left-4 inset-y-0 my-auto"
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm font-normal cursor-pointer flex-1 pl-6"
                >
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="size-3" strokeWidth={2} />
            <span className="text-sm">Date</span>
            {filters.dateRange !== 'allTime' && (
              <React.Fragment>
                <Separator orientation="vertical" className="mr-0.5 h-4" />
                <Badge variant="secondary" className="rounded-sm px-1 w-5 font-normal">
                  1
                </Badge>
              </React.Fragment>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0 flex flex-col" align="start">
          <div className="font-medium text-sm px-4 pt-3 pb-2 border-b">Date Range</div>
          <div className="grid pt-1 pb-3">
            {DATE_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={filters.dateRange === range.value ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start px-4 py-2 rounded-none! hover:bg-accent"
                onClick={() => setFilters({ dateRange: range.value })}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-9 px-2 gap-1.5" onClick={handleClearAll}>
          <span>Clear All</span>
          <X className="size-3" strokeWidth={2} />
        </Button>
      )}
    </div>
  )
}
