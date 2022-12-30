import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { deleteField, doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { appConfig } from "../configs/appConfig.ts";
import { Budget } from '../types/index.ts';
import { getFormattedDate } from "../utils/date.ts";

const firebaseApp = initializeApp(appConfig.firebaseConfig);
const db = getFirestore(firebaseApp);

const addBudgetItem = async (chatId: string, category: string, limit: number) => {
    try {
        const dbRef = doc(db, "budgets", chatId)

        await updateDoc(dbRef, {
            [`budgetItems.${category}`]: {
                limit,
                spent: 0
            }
        })
    } catch (error) {
        console.log("[ERROR] addBudgetItem", JSON.stringify(error))

        if (error.code === "not-found") {
            await createBudgetAndAddBudgetItem(chatId, category, limit)
        }
    }
}

const createBudgetAndAddBudgetItem = async (chatId: string, category: string, limit: number) => {
    try {
        const dbRef = doc(db, "budgets", chatId)
        await setDoc(dbRef, {
            [`budgetItems`]: {
                [`${category}`]: {
                    limit,
                    spent: 0
                }
            }
        }, { merge: true })
    } catch (error) {
        console.log("[ERROR] createBudgetAndAddBudgetItem", JSON.stringify(error))
    }
}

const updateSpent = async (chatId: string, budgetCategory: string, spentAmount: number) => {
    try {
        const dbRef = doc(db, "budgets", chatId)

        await updateDoc(dbRef, {
            [`budgetItems.${budgetCategory}.spent`]: increment(spentAmount),
        })
    } catch (error) {
        console.log("[ERROR] updateSpent", JSON.stringify(error))
    }
}

const getBudget = async (chatId: string): Promise<Budget | undefined> => {
    try {
        const docRef = doc(db, "budgets", chatId)
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    } catch (error) {
        console.log("[ERROR] getBudget", error)
        return undefined
    }
}

const resetBudget = async (chatId: string, budgetCategories: string[]) => {
    try {
        const docRef = doc(db, "budgets", chatId)

        for await (const category of budgetCategories!) {
            updateDoc(docRef, {
                [`budgetItems.${category}.spent`]: 0,
                "lastResetAt": getFormattedDate()
            })
        }

    } catch (error) {
        console.log("[ERROR] resetBudget", error)
    }
}

const removeBudgetCategory = async (chatId: string, budgetCategory: string) => {
    try {
        const docRef = doc(db, "budgets", chatId)

        await updateDoc(docRef, {
            [`budgetItems.${budgetCategory}`]: deleteField(),
        })

    } catch (error) {
        console.log("[ERROR] removeBudgetCategory", error)
    }
}

const removeAllBudgetCategories = async (chatId: string) => {
    try {
        const docRef = doc(db, "budgets", chatId)
        console.log("removeAllBudgetCategories", chatId)

        await updateDoc(docRef, {
            "budgetItems": deleteField(),
        })

    } catch (error) {
        console.log("removeBudgetCategory ERROR:", error)
    }
}

export const DbQueries = {
    addBudgetItem,
    updateSpent,
    getBudget,
    resetBudget,
    removeBudgetCategory,
    removeAllBudgetCategories
}