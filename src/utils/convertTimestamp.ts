import { Timestamp } from 'firebase/firestore';

const convertTimestamp = (timestamp: Timestamp) => {
    return {
        seconds: timestamp.seconds,
        nanoseconds: timestamp.nanoseconds,
    };
};

export default convertTimestamp;