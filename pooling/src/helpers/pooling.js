const pool = (func, time) => {

    let isWorking = false;

    setInterval(async () => {

        if(!isWorking) {

            try {

                isWorking = true;

                await func();
                

            } catch(err) {

                console.log(err);

            } finally {

                isWorking = false;

            }
        } else {
            console.log("skipping pooling")
        }

    }, time);

}

module.exports = {
    pool
}