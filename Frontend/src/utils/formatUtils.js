export function formatDate(dateValue) {
    if (!dateValue) {
        return "Sin fecha"
    }

    if (typeof dateValue === "string") {
        const onlyDate = dateValue.split("T")[0]
        const parts = onlyDate.split("-")

        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`
        }

        return dateValue
    }

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
        return "Sin fecha"
    }

    return date.toLocaleDateString("es-ES")
}

export function formatTime(timeValue) {
    if (!timeValue) {
        return "Sin hora"
    }

    if (typeof timeValue === "string" && timeValue.includes("T")) {
        return timeValue.split("T")[1].slice(0, 5)
    }

    return timeValue
}

export function formatState(stateValue) {
    if (!stateValue) {
        return "Sin estado"
    }

    return stateValue.charAt(0).toUpperCase() + stateValue.slice(1).toLowerCase()
}