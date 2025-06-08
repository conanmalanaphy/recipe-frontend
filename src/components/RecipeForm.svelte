<script lang="ts">
    import { onMount } from 'svelte';

    export let recipeId: string | null = null;
    export let initialRecipe: any | null = null;

    let id: number | null = initialRecipe?.id || null;
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
    let isLoading: boolean = false; // Used for initial fetch or AI processing

 // NEW: State for image upload and AI processing - now an array of File
    let selectedImages: File[] = []; // Changed from selectedImage: File | null
    let aiProcessing: boolean = false;
    let aiErrorMessage: string = '';


    const API_BASE_URL = 'https://recipe-backend-3ata.onrender.com/api/recipes';
    const AI_PARSE_URL = 'http://localhost:8080/api/recipes/parse-image'; // Use localhost for AI endpoint during dev

    $: submitButtonText = id ? 'Update Recipe' : 'Add Recipe';
    $: submittingButtonText = id ? 'Updating Recipe...' : 'Adding Recipe...';

    function populateForm(recipe: any) {
        // Only update fields if AI returned something
        if (recipe.title) title = recipe.title;
        if (recipe.description) description = recipe.description;
        if (recipe.ingredients) ingredients = recipe.ingredients;
        if (recipe.instructions) instructions = recipe.instructions;
        if (recipe.prepTime) prepTime = recipe.prepTime;
        if (recipe.cookTime) cookTime = recipe.cookTime;
        if (recipe.servings) servings = recipe.servings;
        if (recipe.category) category = recipe.category;
        if (recipe.cuisine) cuisine = recipe.cuisine;
        if (recipe.imageUrl) imageUrl = recipe.imageUrl;
        // ID, createdAt, updatedAt are not set by AI for form filling
    }

    onMount(async () => {
        if (recipeId && !initialRecipe) {
            isLoading = true;
            errorMessage = '';
            try {
                const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/</span>{recipeId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Recipe with ID ${recipeId} not found.`);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const fetchedRecipe = await response.json();
                populateForm(fetchedRecipe);
            } catch (error: any) {
                console.error("Error fetching recipe for edit:", error);
                errorMessage = error.message || "Failed to load recipe for editing.";
            } finally {
                isLoading = false;
            }
        } else if (initialRecipe) {
            populateForm(initialRecipe);
        }
    });

    // NEW: Handle image file selection
    // NEW: Handle image file selection (for multiple files)
    function handleImageChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedImages = Array.from(target.files); // Convert FileList to Array
            aiErrorMessage = ''; // Clear previous AI errors
        } else {
            selectedImages = []; // Clear if no files selected
        }
    }

    // NEW: Handle AI Auto-fill button click (for multiple files)
    async function handleAiAutoFill() {
        if (selectedImages.length === 0) { // Check for empty array
            aiErrorMessage = "Please select one or more image files first.";
            return;
        }

        aiProcessing = true;
        aiErrorMessage = '';

        const formData = new FormData();
        // Append each selected image file to FormData
        selectedImages.forEach((file, index) => {
            formData.append('image', file); // 'image' must match @RequestParam name in Spring Boot
        });

        try {
            const response = await fetch(AI_PARSE_URL, {
                method: 'POST',
                body: formData, // No Content-Type header for FormData, fetch handles it
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI processing failed: ${response.status} - ${errorText || 'Server error'}`);
            }

            const parsedRecipe = await response.json();
            populateForm(parsedRecipe); // Populate form fields with AI data
            selectedImages = []; // Clear selected images after processing
            // Optionally give user feedback
            alert('Form auto-filled successfully with AI data!');

        } catch (error: any) {
            console.error("Error with AI auto-fill:", error);
            aiErrorMessage = error.message || "Failed to auto-fill. Please try another image.";
        } finally {
            aiProcessing = false;
        }
    }

    // ... (handleSubmit function - remains largely the same) ...
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
                window.location.href = id ? `/recipes/${id}` : '/';
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

        {#if isLoading}
            <div class="flex justify-center items-center h-48">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="ml-4 text-gray-600">Loading recipe data...</p>
            </div>
        {:else if errorMessage && !id}
            <div role="alert" class="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{errorMessage}</span>
            </div>
        {:else}
            <div class="p-6 bg-blue-50 rounded-lg shadow-sm mb-8 border border-blue-200">
                <h3 class="text-2xl font-semibold text-blue-700 mb-5">Auto-fill with AI</h3>
                <div class="form-control gap-4">
                    <div class="form-control">
                        <label for="imageUpload" class="label"><span class="label-text text-lg font-semibold">Upload Recipe Image:</span></label>
                       <input type="file" id="imageUpload" accept="image/*" multiple on:change={handleImageChange} class="file-input file-input-bordered w-full" />
                           <label class="label">
                            <span class="label-text-alt text-gray-500">Upload a picture of your recipe to let AI try to fill the form.</span>
                        </label>
                    </div>
                    <div class="form-control mt-4">
                       <button type="button" on:click={handleAiAutoFill} class="btn btn-info w-full" disabled={selectedImages.length === 0 || aiProcessing}>
    {#if aiProcessing}
        <span class="loading loading-spinner"></span>
        AI Processing...
    {:else}
        Auto-fill from Image
    {/if}
</button>
                    </div>
                    {#if aiErrorMessage}
                        <div role="alert" class="alert alert-error mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{aiErrorMessage}</span>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="divider my-8"></div>

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
                        <label for="imageUrl" class="label"><span class="label-text text-lg font-semibold">Image URL:</span></label>
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
                        <span class="label-text-alt text-gray-500 mt-1 block">List all ingredients, separated by commas (e.g., "1 cup flour, 2 eggs, 1/2 tsp salt").</span>
                    </div>

                    <div class="form-control">
                        <label for="instructions" class="label"><span class="label-text text-lg font-semibold">Instructions (dot-separated steps):</span></label>
                        <textarea id="instructions" bind:value={instructions} class="textarea textarea-bordered h-40" required placeholder="e.g., 1. Boil pasta. 2. Brown beef. 3. Mix all ingredients."></textarea>
                        <span class="label-text-alt text-gray-500 mt-1 block">Provide step-by-step instructions, separating each step with a period (e.g., "1. First step. 2. Second step.").</span>
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