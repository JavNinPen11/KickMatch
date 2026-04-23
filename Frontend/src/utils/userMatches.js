
// recibe value y si existe lo convierte a texto limpiandolo y lo mete a set
function addUserValue(set, value) {
    if (value === null || value === undefined) {
        return
    }

    const normalized = String(value).trim().toLowerCase()

    if (normalized) {
        set.add(normalized)
    }
}

// devuelve el user actual adaptado al formato de los partidos
//prioriza profile y si faltan datos usa user o valores defecto
export function getMatchUser(user, profile = null) {
    return {
        id: profile?.id ?? user?.id ?? user?.username ?? "guest-user",
        username: profile?.username ?? user?.username ?? "Invitado",
        nombre: profile?.nombre ?? user?.nombre ?? user?.username ?? "Invitado",
        email: profile?.email ?? user?.email ?? "",
        rol: profile?.rol ?? user?.rol ?? null,
    }
}

// prepara los posibles valores con los que identificar al user
export function getUserIdentityValues(user, profile = null) {
    const currentUser = getMatchUser(user, profile)
    const ids = new Set()
    const names = new Set()

    addUserValue(ids, currentUser.id)
    addUserValue(ids, currentUser.username)
    addUserValue(names, currentUser.nombre)
    addUserValue(names, currentUser.username)

    addUserValue(ids, user?.id)
    addUserValue(ids, user?.username)
    addUserValue(names, user?.nombre)

    addUserValue(ids, profile?.id)
    addUserValue(ids, profile?.username)
    addUserValue(names, profile?.nombre)

    return {
        currentUser,
        ids,
        names,
    }
}

// comprueba si el partido es hoy o en un futuro
function isFutureMatch(match) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const matchDate = new Date(match.fecha)
    matchDate.setHours(0, 0, 0, 0)

    return matchDate >= today
}

// ordena los partidos por fecha y hora
function orderMatchesByDate(matches) {
    return [...matches].sort((a, b) => {
        const left = new Date(`${a.fecha}T${a.hora || "00:00"}`)
        const right = new Date(`${b.fecha}T${b.hora || "00:00"}`)
        return left - right
    })
}
// recibe todos los partidos, user y opcionalmente el perfil
// devuelve los aprtidos organizados donde interactua el user en grupos utiles
export function getUserMatchesSummary(matches, user, profile = null) {
    const { currentUser, ids, names } = getUserIdentityValues(user, profile)

    //partiodos creados por el user
    const createdByUser = matches.filter((match) => {
        const creatorId = String(match.creador?.id ?? "").trim().toLowerCase()
        const creatorName = String(match.creador?.nombre ?? "").trim().toLowerCase()

        return ids.has(creatorId) || names.has(creatorName)
    })

    // partidos en los que el user participa
    const joinedByUser = matches.filter((match) =>
        Array.isArray(match.participantes) &&
        match.participantes.some((participant) => {
            const participantId = String(participant.id ?? "").trim().toLowerCase()
            const participantName = String(participant.nombre ?? "").trim().toLowerCase()

            return ids.has(participantId) || names.has(participantName)
        })
    )

    // junta los partidos creados por el user y los que se ha unido
    // los junta sin duplicar
    const uniqueRelatedMatches = new Map()

        ;[...createdByUser, ...joinedByUser].forEach((match) => {
            uniqueRelatedMatches.set(String(match.id), match)
        })

    // union de partidos creados y en los que participa el user, sin duplicados
    const relatedMatches = Array.from(uniqueRelatedMatches.values())
    // partidos futuros del user
    const upcomingMatches = orderMatchesByDate(relatedMatches.filter(isFutureMatch))
    // partidos pasados en el que el user participo
    const playedMatches = orderMatchesByDate(
        joinedByUser.filter((match) => !isFutureMatch(match))
    )

    return {
        currentUser,
        createdMatches: orderMatchesByDate(createdByUser),
        joinedMatches: orderMatchesByDate(joinedByUser),
        relatedMatches: orderMatchesByDate(relatedMatches),
        upcomingMatches,
        activeMatches: upcomingMatches,
        playedMatches,
    }
}
