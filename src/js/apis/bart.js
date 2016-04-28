import { parseString } from 'xml2js';

/*
    This key is publicly available at <http://www.bart.gov/schedules/developers/api>
    under the following conditions:

    We don't make you register for BART open data and our License Agreement is one
    of the least restrictive in the business. So whether you're kicking the tires or
    taking it to production, just give our customers good information and don't hog
    community resources
 */
const key = `MW9S-E7SL-26DU-VV8V`;

export function depart({ orig, dest }) {
    return fetch(
        `http://api.bart.gov/api/sched.aspx?` + [
            `cmd=depart`,
            `orig=${orig}`,
            `dest=${dest}`,
            `date=now`,
            `key=${key}`,
            `b=4`,
            `a=4`
        ].join(`&`))
        .then(result => result.text())
        .then(text =>
            new Promise((resolve, reject) => {
                parseString(
                    text,
                    {
                        explicitRoot: false,
                        explicitArray: false
                    },
                    (error, result) => {
                        if (error) reject(error);

                        const { trip } = result.schedule.request;
                        const trains = (
                            Array.isArray(trip) ? trip : [trip]
                        ).map(trip => trip.leg.$);

                        resolve(trains);
                    }
                );
            })
        );
}
