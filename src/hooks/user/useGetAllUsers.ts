import { setAllUsers } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { useEffect } from "react";
import { UserProps } from "@/types/user.type";

export default function useGetAllUsers() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getAllUsers = async () => {
            const response = await axios.get('/api/users');
            dispatch(setAllUsers(response.data as UserProps[]));
        };
        getAllUsers();
    }, []);
}