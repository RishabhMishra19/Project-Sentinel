import { Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "../../auth/components/ChangePasswordDialog";
import { useState } from "react";

export function PasswordCard() {
  const [open, setOpen] = useState(false);

  const onChangePassword = () => {
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <span>••••••••••••</span>
        </div>

        <Button onClick={onChangePassword} className={"cursor-pointer"}>
          Change Password
        </Button>
        <ChangePasswordDialog open={open} onOpenChange={setOpen} />
      </CardContent>
    </Card>
  );
}
