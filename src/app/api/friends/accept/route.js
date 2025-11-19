import pool from "@/lib/db";

export async function POST(req){
try{
    const {senderId, receiverId } = await req.json()
    if(!senderId || !receiverId) {
        return new Response(JSON.stringify({error: 'Missing user IDs'}), {status:400})
    }
    const result = await pool.friendships.update({
        where: {
            senedr_is_receiver_id:{ sender_id: senderId, receiver_id: receiverId }
        },
        data: {
            status:'accepted'
        }
    });
    return new Response(JSON.stringify({ message: 'Friend request accepted', friendship: result }), {
        status: 200
    });


}catch(error){
    console.error(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
}
}