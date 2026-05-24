import style from "../forms/styleForms/loginForm.module.scss"

export function Loading() {
    return (
        <div className={style.overlay}>
            <img
                className={style.logo}
                src="/system/KickMatchLogo.png"
                alt="KickMatch"
            />
            <p className={style.text}>KickMatch</p>
            <div className={style.dots}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    )
}