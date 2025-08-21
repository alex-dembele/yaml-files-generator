import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitial } from '@/helpers/string-helper';
import { useAuthStore } from '@/auth/auth.store';
import { Link } from 'react-router-dom';

export function ProfileDropdown() {

    // Get the logout mutation
    const { user } = useAuthStore();
    return (
        <DropdownMenu modal={false} >
            <DropdownMenuTrigger asChild >
                <Button variant='ghost' className='relative h-8 w-8 rounded-full' >
                    <Avatar className='h-8 w-8 text-black' >
                        <AvatarImage src='/avatars/01.png' alt='@shadcn' />
                        <AvatarFallback>{getInitial(user?.name ?? "A")} </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            < DropdownMenuContent className='w-56' align='end' forceMount >
                <DropdownMenuLabel className='font-normal' >
                    <div className='flex flex-col space-y-1' >
                        <p className='text-sm font-medium leading-none' > {user?.name} </p>
                        < p className='text-xs leading-none text-muted-foreground' >
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                < DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild >
                        <Link to='/settings' >
                            Profile
                            <DropdownMenuShortcut>⇧⌘P </DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    < DropdownMenuItem asChild >
                        <Link to='/settings' >
                            Billing
                            <DropdownMenuShortcut>⌘B </DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    < DropdownMenuItem asChild >
                        <Link to='/settings' >
                            Settings
                            <DropdownMenuShortcut>⌘S </DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    < DropdownMenuItem > New Team </DropdownMenuItem>
                </DropdownMenuGroup>
                < DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q </DropdownMenuShortcut>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}