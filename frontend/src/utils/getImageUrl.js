export const getImageUrl = (avatarUrl)=>{

    if(!avatarUrl){

        return '/dummyAvatar.png';
    }
    const firstHalfUrl = import.meta.env.VITE_API_URL.replace('/api','');
    const imageUrl = firstHalfUrl + avatarUrl;
    return imageUrl;
  
}