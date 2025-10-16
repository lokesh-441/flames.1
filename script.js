document.addEventListener('DOMContentLoaded', () => {
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultText = document.getElementById('result-text');
    const flameAnimation = document.getElementById('flame-animation');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    const FLAMES_MAP = {
        F: 'Friends 🤝',
        L: 'Lovers ❤️',
        A: 'Affectionate 🥰',
        M: 'Marriage 💍',
        E: 'Enemies 👿',
        S: 'Siblings 🧑‍🤝‍🧑'
    };

    /**
     * Core FLAMES Algorithm: Calculates the relationship result.
     * @param {string} name1 - The first name.
     * @param {string} name2 - The second name.
     * @returns {string} The final FLAMES result (e.g., 'Marriage 💍').
     */
    function calculateFlames(name1, name2) {
        // 1. Clean and normalize names
        let n1 = name1.toLowerCase().replace(/[^a-z]/g, '');
        let n2 = name2.toLowerCase().replace(/[^a-z]/g, '');

        // 2. Cross out common letters and get the count N
        let letters1 = n1.split('');
        let letters2 = n2.split('');

        // Remove common letters
        for (let i = 0; i < letters1.length; i++) {
            const char = letters1[i];
            const index2 = letters2.indexOf(char);
            
            if (index2 !== -1) {
                // Remove the common letter from both arrays
                letters1.splice(i, 1);
                letters2.splice(index2, 1);
                i--; // Decrement to re-check the current index after removal
            }
        }

        const count = letters1.length + letters2.length;
        if (count === 0) return FLAMES_MAP.F; // Default to Friends if names are identical

        // 3. FLAMES Elimination
        let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
        let currentIndex = 0;

        while (flames.length > 1) {
            // Calculate the position to remove (count - 1, since we use 0-based index)
            const removeIndex = (currentIndex + count - 1) % flames.length;
            
            // Remove the letter
            flames.splice(removeIndex, 1);
            
            // Set the new starting point for the next count
            currentIndex = removeIndex % flames.length;
        }

        const finalLetter = flames[0];
        return FLAMES_MAP[finalLetter];
    }
    
    /**
     * Manages browser's Local Storage for history.
     */
    function saveHistory(name1, name2, result) {
        const history = getHistory();
        const newEntry = {
            name1: name1,
            name2: name2,
            result: result,
            timestamp: new Date().toLocaleString()
        };
        history.unshift(newEntry); // Add to the start
        localStorage.setItem('flamesHistory', JSON.stringify(history.slice(0, 10))); // Store up to 10 entries
    }

    function getHistory() {
        const historyString = localStorage.getItem('flamesHistory');
        return historyString ? JSON.parse(historyString) : [];
    }

    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = '';
        clearHistoryBtn.classList.add('hidden');

        if (history.length > 0) {
            history.forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${entry.name1} & ${entry.name2}</strong>: ${entry.result} <span style="float: right; font-size: 0.8em; color: #aaa;">(${entry.timestamp})</span>`;
                historyList.appendChild(li);
            });
            clearHistoryBtn.classList.remove('hidden');
        } else {
            historyList.innerHTML = '<li>No history yet. Start calculating!</li>';
        }
    }
    
    // --- Event Listeners ---
    
    calculateBtn.addEventListener('click', () => {
        const name1 = name1Input.value.trim();
        const name2 = name2Input.value.trim();

        if (name1 === '' || name2 === '') {
            alert('Please enter both names!');
            return;
        }

        // 1. Start Animation
        resultText.classList.add('hidden');
        flameAnimation.style.display = 'block';

        // 2. Calculate Result after a short delay for animation to run
        setTimeout(() => {
            const result = calculateFlames(name1, name2);
            
            // 3. Display Result
            flameAnimation.style.display = 'none';
            resultText.textContent = `The relationship between ${name1} and ${name2} is: ${result}`;
            resultText.classList.remove('hidden');

            // 4. Store and Render History (using Local Storage)
            saveHistory(name1, name2, result);
            renderHistory();

        }, 1500); // 1.5 seconds delay
    });

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('flamesHistory');
        renderHistory();
    });

    // Initial load: Render history from Local Storage
    renderHistory();
});