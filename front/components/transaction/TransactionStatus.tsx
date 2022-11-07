import styles from "./TransactionStatus.module.scss"
function GreenLabel(props: {text: string}) {
    return (
        <div className={styles.selesai}>
            {props.text}
        </div>
    )
}

function YellowLabel(props: {text: string}) {
    return (
        <div className={styles.tiba_di_tujuan}>
            {props.text}
        </div>
    )
}

function RedLabel(props: {text: string}) {
    return (
        <div className={styles.dibatalkan}>
            {props.text}
        </div>
    )
}

function GreyLabel(props: {text: string}) {
    return (
        <div className={styles.greyLabel}>
            {props.text}
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
    GreenLabel,
    YellowLabel,
    RedLabel,
    GreyLabel,
    SelesaiOtomatis
}