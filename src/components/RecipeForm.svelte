<script lang="ts">
    // Form state variables
    let title: string = '';
    let description: string = '';
    let ingredients: string = '';
    let instructions: string = '';
    let prepTime: string = '';
    let cookTime: string = '';
    let servings: string = '';
    let category: string = '';
    let cuisine: string = '';
    let imageUrl: string = '';

    let submitting: boolean = false;
    let successMessage: string = '';
    let errorMessage: string = '';

    const API_URL = 'https://recipe-backend-3ata.onrender.com/api/recipes';

    async function handleSubmit() {
        submitting = true;
        successMessage = '';
        errorMessage = '';

        const newRecipe = {
            title,
            description,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            category,
            cuisine,
            imageUrl
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecipe),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`Failed to add recipe: ${response.status} - ${errorData.message || 'Server error'}`);
            }

            const savedRecipe = await response.json();
            successMessage = `Recipe "${savedRecipe.title}" added successfully! Redirecting...`;

            // Clear the form
            title = '';
            description = '';
            ingredients = '';
            instructions = '';
            prepTime = '';
            cookTime = '';
            servings = '';
            category = '';
            cuisine = '';
            imageUrl = '';

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = '/'; // Redirect to homepage
            }, 2000);

        } catch (error: any) {
            console.error("Error submitting recipe:", error);
            errorMessage = error.message || "An unexpected error occurred.";
        } finally {
            submitting = false;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="card bg-white shadow-xl p-8 max-w-2xl mx-auto my-8">
    <div class="card-body p-0">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Recipe Information</h2>

        <div class="form-control gap-4">
            <div class="form-control">
                <label for="title" class="label"><span class="label-text text-lg font-semibold">Recipe Title:</span></label>
                <input type="text" id="title" bind:value={title} class="input input-bordered input-lg w-full" required />
            </div>

            <div class="form-control">
                <label for="description" class="label"><span class="label-text text-lg font-semibold">Description:</span></label>
                <textarea id="description" bind:value={description} class="textarea textarea-bordered h-24" required placeholder="A brief overview of your recipe..."></textarea>
            </div>

            <div class="form-control">
                <label for="imageUrl" class="label"><span class="label-text text-lg font-semibold">Image URL:</span></label>
                <input type="url" id="imageUrl" bind:value={imageUrl} class="input input-bordered w-full" placeholder="https://example.com/your-recipe-image.jpg" />
            </div>
        </div>

        <div class="divider my-8"></div> <h3 class="text-2xl font-semibold text-gray-800 mb-4">Ingredients & Instructions</h3>
        <div class="form-control gap-4">
            <div class="form-control">
                <label for="ingredients" class="label"><span class="label-text text-lg font-semibold">Ingredients (comma-separated):</span></label>
                <textarea id="ingredients" bind:value={ingredients} class="textarea textarea-bordered h-32" required placeholder="e.g., 2 cups pasta, 1/2 lb ground beef, 1 can tomatoes"></textarea>
            </div>

            <div class="form-control">
                <label for="instructions" class="label"><span class="label-text text-lg font-semibold">Instructions (dot-separated steps):</span></label>
                <textarea id="instructions" bind:value={instructions} class="textarea textarea-bordered h-40" required placeholder="e.g., 1. Boil pasta. 2. Brown beef. 3. Mix all ingredients."></textarea>
            </div>
        </div>

        <div class="divider my-8"></div> <h3 class="text-2xl font-semibold text-gray-800 mb-4">Details & Categorization</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
                <label for="prepTime" class="label"><span class="label-text">Preparation Time:</span></label>
                <input type="text" id="prepTime" bind:value={prepTime} class="input input-bordered w-full" placeholder="e.g., 15 min" />
            </div>

            <div class="form-control">
                <label for="cookTime" class="label"><span class="label-text">Cook Time:</span></label>
                <input type="text" id="cookTime" bind:value={cookTime} class="input input-bordered w-full" placeholder="e.g., 30 min" />
            </div>

            <div class="form-control">
                <label for="servings" class="label"><span class="label-text">Servings:</span></label>
                <input type="text" id="servings" bind:value={servings} class="input input-bordered w-full" placeholder="e.g., 4-6" />
            </div>

            <div class="form-control">
                <label for="category" class="label"><span class="label-text">Category:</span></label>
                <input type="text" id="category" bind:value={category} class="input input-bordered w-full" placeholder="e.g., Dinner, Dessert, Breakfast" />
            </div>

            <div class="form-control">
                <label for="cuisine" class="label"><span class="label-text">Cuisine:</span></label>
                <input type="text" id="cuisine" bind:value={cuisine} class="input input-bordered w-full" placeholder="e.g., Italian, Mexican, Asian" />
            </div>
        </div>

        <div class="form-control mt-10">
            <button type="submit" class="btn btn-primary btn-lg w-full" disabled={submitting}>
                {#if submitting}
                    <span class="loading loading-spinner"></span>
                    Adding Recipe...
                {:else}
                    Add Recipe
                {/if}
            </button>
        </div>

        {#if successMessage}
            <div role="alert" class="alert alert-success mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{successMessage}</span>
            </div>
        {/if}

        {#if errorMessage}
            <div role="alert" class="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errorMessage}</span>
            </div>
        {/if}
    </div>
</form>