import styles from "./TransactionStatus.module.scss"
function Selesai() {
    return (
        <div className={styles.selesai}>
            Selesai
        </div>
    )
}

function TibaDiTujuan() {
    return (
        <div className={styles.tiba_di_tujuan}>
            Tiba di Tujuan
        </div>
    )
}

function Dibatalkan() {
    return (
        <div className={styles.dibatalkan}>
            Dibatalkan
        </div>
    )
}

function SelesaiOtomatis(props: { hour: string }) {
    return (
        <div className={styles.selesai_otomatis}>
            <span></span>
            {props.hour}
        </div>
    )
}

export {
    Selesai,
    TibaDiTujuan,
    Dibatalkan,
    SelesaiOtomatis
}