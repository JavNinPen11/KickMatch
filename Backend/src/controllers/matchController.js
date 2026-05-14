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
export{
    createMatch
}