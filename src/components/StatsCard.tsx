
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
    <Card className="hover:shadow-lg transition-shadow duration-200 border-slate-700 bg-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend && (
              <Badge 
                variant="secondary" 
                className={`mt-2 ${
                  trendUp 
                    ? 'bg-green-900 text-green-300 hover:bg-green-900' 
                    : 'bg-red-900 text-red-300 hover:bg-red-900'
                }`}
              >
                {trend}
              </Badge>
            )}
          </div>
          <div className="p-3 bg-blue-900 rounded-full">
            <Icon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
