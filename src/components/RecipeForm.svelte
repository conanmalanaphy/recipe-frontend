<script lang="ts">
    import { onMount } from 'svelte';

    // Add a new prop to receive the recipe ID from the URL (no longer strictly needed for fetch here)
   export const recipeId: string | null = null;

    // Prop to receive initial recipe data (now expected to be pre-fetched by Astro)
    export let initialRecipe: any | null = null; // This will now typically contain the recipe object


    // Form state variables
    let id: number | null = initialRecipe?.id || null; // Store numeric ID for PUT requests
    let title: string = initialRecipe?.title || '';
    let description: string = initialRecipe?.description || '';
    let ingredients: string = initialRecipe?.ingredients || '';
    let instructions: string = initialRecipe?.instructions || '';
    let prepTime: string = initialRecipe?.prepTime || '';
    let cookTime: string = initialRecipe?.cookTime || '';
    let servings: string = initialRecipe?.servings || '';
    let category: string = initialRecipe?.category || '';
    let cuisine: string = initialRecipe?.cuisine || '';
    let imageUrl: string = initialRecipe?.imageUrl || '';

    let submitting: boolean = false;
    let successMessage: string = '';
    let errorMessage: string = '';
    let isLoading: boolean = false; // No longer needed for initial fetch, but keeping for clarity

    const API_BASE_URL = 'https://recipe-backend-3ata.onrender.com/api/recipes';

    // Update button text reactively
    $: submitButtonText = id ? 'Update Recipe' : 'Add Recipe';
    $: submittingButtonText = id ? 'Updating Recipe...' : 'Adding Recipe...';

    // Function to populate form fields from a recipe object
    function populateForm(recipe: any) {
        id = recipe.id;
        title = recipe.title;
        description = recipe.description;
        ingredients = recipe.ingredients;
        instructions = recipe.instructions;
        prepTime = recipe.prepTime;
        cookTime = recipe.cookTime;
        servings = recipe.servings;
        category = recipe.category;
        cuisine = recipe.cuisine;
        imageUrl = recipe.imageUrl;
        // createdAt and updatedAt are not for form fields
    }

    onMount(() => {
        // Populate form fields if initialRecipe prop is provided by Astro
        if (initialRecipe) {
            populateForm(initialRecipe);
        }
        // No client-side fetch for initial data is needed here anymore as getStaticPaths provides it
    });


    async function handleSubmit() {
        submitting = true;
        successMessage = '';
        errorMessage = '';

        const recipeData = {
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
            // Note: createdAt and updatedAt are handled by the backend
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                throw new Error(`Failed to ${id ? 'update' : 'add'} recipe: ${response.status} - ${errorData.message || 'Server error'}`);
            }

            const savedRecipe = await response.json();
            successMessage = `Recipe "${savedRecipe.title}" ${id ? 'updated' : 'added'} successfully! Redirecting...`;

            // If adding (not updating), clear the form after success
            if (!id) {
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
            }

            setTimeout(() => {
                window.location.href = id ? `/recipes/${id}` : '/'; // Redirect to detail page if updating, or home if adding
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
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">{id ? 'Edit Recipe' : 'Share Your Recipe'}</h2>

        {#if isLoading} <div class="flex justify-center items-center h-48">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="ml-4 text-gray-600">Loading recipe data...</p>
            </div>
        {:else if errorMessage && !id} <div role="alert" class="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errorMessage}</span>
            </div>
        {:else}
            <div class="p-6 bg-gray-50 rounded-lg shadow-sm mb-8 border border-gray-200">
                <h3 class="text-2xl font-semibold text-gray-700 mb-5">Basic Information</h3>
                <div class="form-control gap-4">
                    <div class="form-control">
                        <label for="title" class="label"><span class="label-text text-lg font-semibold">Recipe Title:</span></label>
                        <input type="text" id="title" bind:value={title} class="input input-bordered input-lg w-full" required placeholder="e.g., Classic Spaghetti Carbonara" />
                    </div>

                    <div class="form-control">
                        <label for="description" class="label"><span class="label-text text-lg font-semibold">Description:</span></label>
                        <textarea id="description" bind:value={description} class="textarea textarea-bordered h-24" required placeholder="A brief overview of your recipe, its origin, or what makes it special..."></textarea>
                    </div>

                   <div class="form-control">
    <label for="imageUrl" class="label">
        <span class="label-text text-lg font-semibold">Image URL:</span>
    </label>
    <input type="url" id="imageUrl" bind:value={imageUrl} class="input input-bordered w-full" placeholder="https://example.com/your-recipe-image.jpg" />
    <span class="label-text-alt text-gray-500 mt-1 block">Link to a high-quality image of your delicious recipe.</span>
</div>
                </div>
            </div>

            <div class="divider my-8"></div>

            <div class="p-6 bg-white rounded-lg shadow-sm mb-8 border border-gray-200">
                <h3 class="text-2xl font-semibold text-gray-700 mb-4">Ingredients & Instructions</h3>
                <div class="form-control gap-4">
                    <div class="form-control">
                        <label for="ingredients" class="label"><span class="label-text text-lg font-semibold">Ingredients (comma-separated):</span></label>
                        <textarea id="ingredients" bind:value={ingredients} class="textarea textarea-bordered h-32" required placeholder="e.g., 2 cups pasta, 1/2 lb ground beef, 1 can tomatoes"></textarea>
                        <label class="label">
                            <span class="label-text-alt text-gray-500">List all ingredients, separated by commas (e.g., "1 cup flour, 2 eggs, 1/2 tsp salt").</span>
                        </label>
                    </div>

                    <div class="form-control">
                        <label for="instructions" class="label"><span class="label-text text-lg font-semibold">Instructions (dot-separated steps):</span></label>
                        <textarea id="instructions" bind:value={instructions} class="textarea textarea-bordered h-40" required placeholder="e.g., 1. Boil pasta. 2. Brown beef. 3. Mix all ingredients."></textarea>
                        <label class="label">
                            <span class="label-text-alt text-gray-500">Provide step-by-step instructions, separating each step with a period (e.g., "1. First step. 2. Second step.").</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="divider my-8"></div>

            <div class="p-6 bg-white rounded-lg shadow-sm mb-8 border border-gray-200">
                <h3 class="text-2xl font-semibold text-gray-700 mb-4">Details & Categorization</h3>
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
            </div>

            <div class="form-control mt-10">
                <button type="submit" class="btn btn-primary btn-lg w-full" disabled={submitting || isLoading}>
                    {#if submitting}
                        <span class="loading loading-spinner"></span>
                        {submittingButtonText}
                    {:else}
                        {submitButtonText}
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
            {/if}
    </div>
</form>