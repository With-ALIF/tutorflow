export const getDashboardCards = (stats: any) => [
  {
    label: "Total Students",
    value: stats?.totalStudents || 0,
    icon: "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-student-glyph-black-icon-png-image_691145.jpg",
    color: "bg-blue-500",
    trend: "+12% from last month",
    link: "/students"
  },
  {
    label: "Monthly Income",
    value: `৳${(stats?.monthlyIncome || 0).toLocaleString()}`,
    icon: "https://png.pngtree.com/png-vector/20231211/ourmid/pngtree-payment-icon-income-png-image_10858293.png",
    color: "bg-emerald-500",
    trend: "+8% from last month",
    link: "/fees"
  },
  {
    label: "Due Fees",
    value: `৳${(stats?.dueFees || 0).toLocaleString()}`,
    icon: "https://www.shutterstock.com/image-vector/education-grant-icon-on-white-260nw-2256198049.jpg",
    color: "bg-orange-500",
    trend: "Requires attention",
    link: "/fees"
  }
];
