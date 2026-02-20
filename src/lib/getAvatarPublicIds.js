import cloudinary from "./cloudinary";

let cachedAvatars = null

export async function getAvatarPublicIds(){
    if(cachedAvatars) return cachedAvatars

    const result = await cloudinary.api.resources({
        type: "upload",
        max_results: 100,
    })
    cachedAvatars = result.resources.map((file)=> file.public_id)
    return cachedAvatars
}


export async function getRandomAvatar() {
    const avatar = await getAvatarPublicIds()

    return avatar[Math.floor(Math.random() * avatar.length)]
}