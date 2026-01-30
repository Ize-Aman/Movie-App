import { auth, userDocRef } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { getDoc, setDoc } from "firebase/firestore";

const ensureUserDoc = async (user, displayNameOverride) => {
    if (!user) return;

    const docRef = userDocRef(user.uid);
    const snap = await getDoc(docRef);

    const displayName = displayNameOverride ?? user.displayName ?? "";
    const email = user.email ?? "";

    if (snap.exists()) {
        await setDoc(
            docRef,
            { displayName, email },
            { merge: true }
        );
    } else {
        await setDoc(docRef, {
            displayName,
            email,
            watchlist: [],
            watched: [],
        });
    }
};

export const doCreateUserWithEmailAndPassword = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const cleanedName = (displayName || "").trim();

    if (cleanedName) {
        await updateProfile(result.user, { displayName: cleanedName });
    }

    await ensureUserDoc(result.user, cleanedName || undefined);
    return result;
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserDoc(result.user);

    return result;
};

export const doSignOut = async () => {
    return auth.signOut();
};