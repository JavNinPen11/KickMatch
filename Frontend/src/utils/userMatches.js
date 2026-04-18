function addCandidate(set, value) {
    if (value === null || value === undefined) {
        return
    }

    const normalized = String(value).trim().toLowerCase()

    if (normalized) {
        set.add(normalized)
    }
}

export function getCurrentMatchUser(user, profile = null) {
    return {
        id: profile?.id ?? user?.id ?? user?.username ?? "guest-user",
        username: profile?.username ?? user?.username ?? "Invitado",
        nombre: profile?.nombre ?? user?.nombre ?? user?.username ?? "Invitado",
        email: profile?.email ?? user?.email ?? "",
        rol: profile?.rol ?? user?.rol ?? null,
    }
}

export function getUserIdentityCandidates(user, profile = null) {
    const currentUser = getCurrentMatchUser(user, profile)
    const ids = new Set()
    const names = new Set()

    addCandidate(ids, currentUser.id)
    addCandidate(ids, currentUser.username)
    addCandidate(names, currentUser.nombre)
    addCandidate(names, currentUser.username)

    addCandidate(ids, user?.id)
    addCandidate(ids, user?.username)
    addCandidate(names, user?.nombre)

    addCandidate(ids, profile?.id)
    addCandidate(ids, profile?.username)
    addCandidate(names, profile?.nombre)

    return {
        currentUser,
        ids,
        names,
    }
}

function isFutureMatch(match) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const matchDate = new Date(match.fecha)
    matchDate.setHours(0, 0, 0, 0)

    return matchDate >= today
}

function sortMatchesByDate(matches) {
    return [...matches].sort((a, b) => {
        const left = new Date(`${a.fecha}T${a.hora || "00:00"}`)
        const right = new Date(`${b.fecha}T${b.hora || "00:00"}`)
        return left - right
    })
}

export function getUserMatchesSummary(matches, user, profile = null) {
    const { currentUser, ids, names } = getUserIdentityCandidates(user, profile)

    const createdByUser = matches.filter((match) => {
        const creatorId = String(match.creador?.id ?? "").trim().toLowerCase()
        const creatorName = String(match.creador?.nombre ?? "").trim().toLowerCase()

        return ids.has(creatorId) || names.has(creatorName)
    })

    const joinedByUser = matches.filter((match) =>
        Array.isArray(match.participantes) &&
        match.participantes.some((participant) => {
            const participantId = String(participant.id ?? "").trim().toLowerCase()
            const participantName = String(participant.nombre ?? "").trim().toLowerCase()

            return ids.has(participantId) || names.has(participantName)
        })
    )

    const uniqueRelatedMatches = new Map()

    ;[...createdByUser, ...joinedByUser].forEach((match) => {
        uniqueRelatedMatches.set(String(match.id), match)
    })

    const relatedMatches = Array.from(uniqueRelatedMatches.values())
    const upcomingMatches = sortMatchesByDate(relatedMatches.filter(isFutureMatch))
    const playedMatches = sortMatchesByDate(
        joinedByUser.filter((match) => !isFutureMatch(match))
    )

    return {
        currentUser,
        createdMatches: sortMatchesByDate(createdByUser),
        joinedMatches: sortMatchesByDate(joinedByUser),
        relatedMatches: sortMatchesByDate(relatedMatches),
        upcomingMatches,
        activeMatches: upcomingMatches,
        playedMatches,
    }
}
