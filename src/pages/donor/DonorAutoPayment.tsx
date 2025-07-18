import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function DonorAutoPayment() {
  const getNextAutoDebitDate = () => {
    const today = new Date();
    const year = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
    const month = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
    return new Date(year, month, 1).toISOString().slice(0, 10);
  };
  const [autoPayment, setAutoPayment] = useState({
    enabled: true,
    amount: 50000,
    frequency: "monthly",
    nextDate: getNextAutoDebitDate(),
    reminderDays: 3
  });

  return (
    <div className="main-content-container">
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Auto Payment</CardTitle>
          <CardDescription>Manage your automatic donation settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-Debit</div>
              <div className="text-sm text-muted-foreground">Enable automatic monthly donations</div>
            </div>
            <Switch
              checked={autoPayment.enabled}
              onCheckedChange={(checked) => setAutoPayment(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {autoPayment.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Monthly Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={autoPayment.amount}
                  onChange={(e) => setAutoPayment(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={autoPayment.frequency} onValueChange={(value) => setAutoPayment(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="half-yearly">Half Yearly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reminder">Reminder Days Before</Label>
                <Input
                  id="reminder"
                  type="number"
                  value={autoPayment.reminderDays}
                  onChange={(e) => setAutoPayment(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                  placeholder="Days before donation"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Next Auto-Debit</div>
                <div className="text-sm text-blue-600">{autoPayment.nextDate}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 