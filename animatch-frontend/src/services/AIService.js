export const generateAndInsertAiRecs = async (token) => {
    const response = await fetch(
        `${import.meta.env.VITE_LOCAL_URL}/recommendations/`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        }
    );

    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

