export type DummyTenant = {
  id: string
  name: string
  slug: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

export const DUMMY_TENANTS: DummyTenant[] = [
  {
    id: 't-1',
    name: 'Acme Corp',
    slug: 'acme',
    status: 'ACTIVE',
    createdAt: '2025-11-02T10:15:00Z',
  },
  {
    id: 't-2',
    name: 'Globex Industries',
    slug: 'globex',
    status: 'ACTIVE',
    createdAt: '2025-12-18T14:30:00Z',
  },
  {
    id: 't-3',
    name: 'Initech',
    slug: 'initech',
    status: 'INACTIVE',
    createdAt: '2026-01-08T09:00:00Z',
  },
  {
    id: 't-4',
    name: 'Umbrella Health',
    slug: 'umbrella',
    status: 'ACTIVE',
    createdAt: '2026-02-21T16:45:00Z',
  },
  {
    id: 't-5',
    name: 'Stark Dynamics',
    slug: 'stark',
    status: 'INACTIVE',
    createdAt: '2026-03-03T11:20:00Z',
  },
  {
    id: 't-6',
    name: 'Wayne Enterprises',
    slug: 'wayne',
    status: 'ACTIVE',
    createdAt: '2026-04-12T08:10:00Z',
  },
  {
    id: 't-7',
    name: 'Soylent Systems',
    slug: 'soylent',
    status: 'ACTIVE',
    createdAt: '2026-05-01T13:55:00Z',
  },
  {
    id: 't-8',
    name: 'Hooli',
    slug: 'hooli',
    status: 'INACTIVE',
    createdAt: '2026-06-14T19:05:00Z',
  },
  {
    id: 't-9',
    name: 'Pied Piper',
    slug: 'pied-piper',
    status: 'ACTIVE',
    createdAt: '2026-07-01T07:40:00Z',
  },
  {
    id: 't-10',
    name: 'Massive Dynamic',
    slug: 'massive',
    status: 'ACTIVE',
    createdAt: '2026-07-20T12:00:00Z',
  },
  {
    id: 't-11',
    name: 'Cyberdyne',
    slug: 'cyberdyne',
    status: 'INACTIVE',
    createdAt: '2024-09-09T15:25:00Z',
  },
  {
    id: 't-12',
    name: 'Aperture Labs',
    slug: 'aperture',
    status: 'ACTIVE',
    createdAt: '2025-08-28T18:00:00Z',
  },
]
