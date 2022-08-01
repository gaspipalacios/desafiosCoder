process.on('message', (msj) => {
    const param = Number(process.argv[2])
    if(msj == 'empezar') {
        let randoms = []
        let repeats = {}
        for(i = 0; i < param; i++){
            let random = Math.round(Math.random() * (2000 - 1) + 1)
            randoms.push(random)
        }
        randoms.forEach((e) => repeats[e] = (repeats[e] || 0) + 1)
        process.send(repeats)
    }
})