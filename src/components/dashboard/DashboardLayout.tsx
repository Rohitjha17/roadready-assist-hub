import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Car,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Truck,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  role: string[];
  isActive?: (pathname: string) => boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, userRole, signOut, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Attempting to log out");
      const { error } = await signOut();
      if (!error) {
        toast({
          title: "Success",
          description: "You have been logged out successfully",
        });
        navigate("/");
      } else {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  console.log("Current user role:", userRole);
  console.log("Current location:", location.pathname);

  const navigation: NavItem[] = [
    {
      id: "user-dashboard",
      title: "Dashboard",
      href: `/dashboard/${userRole}`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      role: ["user", "seller", "worker"],
      isActive: (pathname) => pathname === `/dashboard/${userRole}`
    },
    {
      id: "user-book-service",
      title: "Book Service",
      href: "/dashboard/user/book-service",
      icon: <Car className="h-5 w-5" />,
      role: ["user"],
    },
    {
      id: "user-requests",
      title: "My Requests",
      href: "/dashboard/user/requests",
      icon: <ClipboardList className="h-5 w-5" />,
      role: ["user"],
    },
    {
      id: "user-shop",
      title: "Shop",
      href: "/dashboard/user/shop",
      icon: <ShoppingCart className="h-5 w-5" />,
      role: ["user"],
    },
    {
      id: "user-cart",
      title: "Shopping Cart",
      href: "/dashboard/user/cart",
      icon: <ShoppingCart className="h-5 w-5" />,
      role: ["user"],
    },
    {
      id: "seller-dashboard",
      title: "Dashboard",
      href: "/dashboard/seller",
      icon: <LayoutDashboard className="h-5 w-5" />,
      role: ["seller"],
      isActive: (pathname) => pathname === "/dashboard/seller",
    },
    {
      id: "seller-products",
      title: "My Products",
      href: "/dashboard/seller/products",
      icon: <Package className="h-5 w-5" />,
      role: ["seller"],
    },
    {
      id: "seller-add-product",
      title: "Add Product",
      href: "/dashboard/seller/add-product",
      icon: <Package className="h-5 w-5" />,
      role: ["seller"],
    },
    {
      id: "worker-dashboard",
      title: "Active Jobs",
      href: "/dashboard/worker",
      icon: <Truck className="h-5 w-5" />,
      role: ["worker"],
      isActive: (pathname) => pathname === "/dashboard/worker",
    },
    {
      id: "user-settings",
      title: "Settings",
      href: `/dashboard/${userRole}/settings`,
      icon: <Settings className="h-5 w-5" />,
      role: ["user", "seller", "worker"],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.role.includes(userRole || "")
  );

  // Check if the current path matches the nav item
  const isActive = (navItem: NavItem) => {
    if (navItem.isActive) {
      return navItem.isActive(location.pathname);
    }
    return location.pathname === navItem.href;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-orva-blue">ORVA</h1>
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{userData?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {userRole} Account
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavigation.map((item) => (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(item)
                        ? "bg-gray-100 text-orva-blue"
                        : "text-gray-600 hover:text-orva-blue hover:bg-gray-50"
                    )}
                    onClick={() => {
                      navigate(item.href);
                      setIsSidebarOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Button>
                </li>
              ))}
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="lg:hidden font-bold text-lg text-orva-blue">ORVA</div>
            <div></div> {/* Empty div for flex spacing */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
