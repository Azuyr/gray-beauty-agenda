
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-brand-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brand-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-brand-gray-900">{value}</p>
            {trend && (
              <Badge 
                variant="secondary" 
                className={`mt-2 ${
                  trendUp 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                    : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {trend}
              </Badge>
            )}
          </div>
          <div className="p-3 bg-brand-blue-50 rounded-full">
            <Icon className="h-6 w-6 text-brand-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
