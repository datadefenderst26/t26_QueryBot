import { mockUsers } from '@/data/mockData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Shield, User as UserIcon, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserManagement() {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-warning" />;
      case 'user':
        return <UserIcon className="w-4 h-4 text-primary" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      'admin': 'bg-warning/20 text-warning border-warning/30',
      'user': 'bg-primary/20 text-primary border-primary/30',
      'viewer': 'bg-muted text-muted-foreground border-border',
    };
    return variants[role] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="glass-card overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div>
          <h3 className="font-medium">User Management</h3>
          <p className="text-xs text-muted-foreground mt-1">Manage team access and permissions</p>
        </div>
        <Button size="sm" className="bg-accent hover:bg-accent/90">
          Add User
        </Button>
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockUsers.map((user, index) => (
              <TableRow 
                key={user.id} 
                className="table-row-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", getRoleBadge(user.role))}>
                    <span className="flex items-center gap-1.5">
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "status-dot",
                      user.status === 'active' ? "status-online" : "status-offline"
                    )} />
                    <span className="text-sm capitalize">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastActive.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card">
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
