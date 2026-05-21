
const createMatch = async (req, res) => {
    const { date, time, location, maxPlayers, state, creatorId } = req.body
    try{
        const match = await prisma.match.create({
            data: {
                date,
                time,
                location,
                maxPlayers,
                state,
                creatorId,
            }
        })
        return res.status(201).json({
            message: "Partido creado correctamente",
            match: {
                date: match.date,
                time: match.time,
                location: match.location,
                creatorId: match.creatorId
            }
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ message: "Error interno en el servidor"})
    }
}
export const getMatches = async (req, res) => {
    try{
        const matches = await prisma.match.findMany({
            include:{
                creator: true
            },
            orderBy:{
                date: "desc"
            }
        })
        return res.status(200).json({matches})
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Error interno del servidor", error})
    }
}

const myMatches = async (req, res) => {
    const id = req.user.id
    try{
        const matches = await prisma.match.findMany({
            include:{
                creator: true
            },
            where:{
                creatorId: id
            },
            orderBy:{
                date: "asc"
            }
        })
        return res.status(200).json({matches})
    }
    catch (error){
        console.error(error)
        return res.status(500).json({message: "Error interno del servidor", error})
    }
}
const deleteMatch = async (req, res) =>{
    const matchId = req.body.matchId
    try{
        await prisma.match.delete({
            where:{
                id: parseInt(matchId)
            }
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message: "Error interno del servido", error})
    }
}
export{
    createMatch,
    myMatches,
    deleteMatch
}