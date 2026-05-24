import style from "./Loading.module.scss"

function Loading() {
    return (
        <div className={style.overlay}>
            <div className={style.spinner}></div>
            <p>Cargando...</p>
        </div>
    )
}
export default Loading