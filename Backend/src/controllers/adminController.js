const getAllMatches = async (req, res) => {
    try{
        const matches = await prisma.match.findMany({
            include:{
                creator: true
            },
            orderBy:{
                date: "asc"
            }
        })
        return res.status(200).json({
            matches
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Error interno del servidor", error: error})
    }
}
export{
    getAllMatches
}