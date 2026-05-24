import { Nav } from "../components/nav/Nav"
import style from "./stylePages/termsPage.module.scss"

export default function TermsPage() {
    return (
        <main className="mainPage">
            <Nav />

            <div className="content">
                <section className={style.header}>
                    <span className="labelYellow">Legal</span>
                    <h1>Términos y condiciones</h1>
                    <p className="textBase">
                        Última actualización: {new Date().toLocaleDateString("es-ES")}
                    </p>
                </section>

                <article className={`cardBase ${style.doc}`}>
                    <section className={style.section}>
                        <h2>1. Aceptación de los términos</h2>
                        <p>Al acceder y utilizar KickMatch, aceptas quedar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de los mismos, no podrás acceder al servicio.</p>
                    </section>

                    <section className={style.section}>
                        <h2>2. Descripción del servicio</h2>
                        <p>KickMatch es una plataforma social orientada a la organización de partidos de fútbol amateur. Permite a los usuarios crear partidos, apuntarse a encuentros existentes y reservar pistas deportivas.</p>
                    </section>

                    <section className={style.section}>
                        <h2>3. Registro de usuario</h2>
                        <p>Para acceder a las funcionalidades principales de KickMatch es necesario crear una cuenta. El usuario se compromete a proporcionar información verídica y a mantener la confidencialidad de sus credenciales de acceso.</p>
                    </section>

                    <section className={style.section}>
                        <h2>4. Uso aceptable</h2>
                        <p>El usuario se compromete a utilizar KickMatch de forma responsable y respetuosa. Queda prohibido:</p>
                        <ul>
                            <li>Crear partidos o reservas con información falsa.</li>
                            <li>Suplantar la identidad de otros usuarios.</li>
                            <li>Utilizar la plataforma con fines comerciales no autorizados.</li>
                            <li>Publicar contenido ofensivo o inapropiado.</li>
                        </ul>
                    </section>

                    <section className={style.section}>
                        <h2>5. Reservas y partidos</h2>
                        <p>Los usuarios son responsables de los partidos que crean y las reservas que realizan. KickMatch actúa como intermediario y no se hace responsable de incidencias que puedan surgir entre usuarios durante la celebración de los partidos.</p>
                    </section>

                    <section className={style.section}>
                        <h2>6. Privacidad de datos</h2>
                        <p>KickMatch recopila y almacena datos personales necesarios para el funcionamiento del servicio, como nombre, correo electrónico y actividad en la plataforma. Estos datos no serán cedidos a terceros sin consentimiento explícito del usuario.</p>
                    </section>

                    <section className={style.section}>
                        <h2>7. Cancelación de cuenta</h2>
                        <p>El usuario puede solicitar la eliminación de su cuenta en cualquier momento desde la sección de perfil. Una vez eliminada, todos los datos asociados serán borrados de forma permanente.</p>
                    </section>

                    <section className={style.section}>
                        <h2>8. Modificaciones</h2>
                        <p>KickMatch se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a los usuarios mediante la plataforma.</p>
                    </section>

                    <section className={style.section}>
                        <h2>9. Contacto</h2>
                        <p>Para cualquier consulta relacionada con estos términos, puedes contactarnos a través de la página de contacto o escribirnos a kickmatch.app@gmail.com.</p>
                    </section>
                </article>
            </div>
        </main>
    )
}