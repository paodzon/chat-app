'use client'
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/Button'


const Users = () => {
    const session = useSession();
    const user = session.data?.user;
    return (
        <div className='flex flex-col justify-center items-center h-full'>
            <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-gray-900">Profile Details</h2>
            <h5>Email: {user?.email}</h5>
            <h5>Name: {user?.name}</h5><br />
            <div className='w-80'>
                <Button fullWidth={true} onClick={() => signOut()} type='button' >Sign Out</Button>
            </div>
        </div>

    )
}

export default Users