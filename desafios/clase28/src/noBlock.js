process.on('message', (msj) => {
    //const param = Number(process.argv[2])
    if(msj == 'empezar') {
        let randoms = []
        for(i = 0; i < 1000/*param*/; i++){
            let random = Math.round(Math.random() * (2000 - 1) + 1)
            randoms.push(random)
        }
        process.send(randoms)
    }
})