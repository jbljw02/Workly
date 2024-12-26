import { setAllUsers, UserProps } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import { useEffect } from "react";

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