import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#111827]">
      <AdminSidebar />
      <main className="flex-1 ml-64 overflow-x-hidden">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
