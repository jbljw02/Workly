import { collection, getDocs } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import fireStore from "../../../../firebase/firestore";

// 사용자 가져오기 - READ
export async function GET(req: NextRequest) {
    try {
        const userCollection = collection(fireStore, 'users');
        const userSnapshot = await getDocs(userCollection);

        const users = userSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
            };
        });

        return NextResponse.json(users, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "전체 사용자 가져오기 실패" }, { status: 500 });
    }
}