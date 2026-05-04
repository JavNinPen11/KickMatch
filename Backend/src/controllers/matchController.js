
const createMatch = async (req, res) => {
    const { title, date, time, location, maxPlayers, state, creatorId, created, user} = req.body

    try{
        const match = await prisma.match.create({
            data: {
                date,
                time,
                location,
                maxPlayers,
                state,
                creatorId,
                created
            }
        })
        return res.status(201).json({
            message: "Partido creado correctamente",
            match: {
                date: match.data,
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
export{
    createMatch
}