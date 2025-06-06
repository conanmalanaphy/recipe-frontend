<script lang="ts">
    // Ensure this matches the recipe structure your API returns
    export let recipe: {
        id: number;
        title: string;
        description: string;
        ingredients: string;
        instructions: string;
        prepTime: string;
        cookTime: string;
        servings: string;
        category: string;
        cuisine: string;
        imageUrl: string;
        createdAt: string; // Use string for dates from API initially
        updatedAt: string;
    };

    let deleting: boolean = false; // To show loading state for delete button

    

    async function handleDelete() {
        // ... (confirmation dialog) ...
    const confirmDelete = window.confirm(`Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`);
    const API_URL = 'https://recipe-backend-3ata.onrender.com/api/recipes';

        if (confirmDelete) {
            deleting = true;
            try {
                // Make sure these are BACKTICKS (`) around the URL string!
                const response = await fetch(`${API_URL}/${recipe.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to delete recipe: ${response.status} - ${errorText || 'Server error'}`);
                }

                alert(`Recipe "${recipe.title}" successfully deleted!`);
                window.location.href = '/';

            } catch (error: any) {
                console.error("Error deleting recipe:", error);
                alert(`Error deleting recipe: ${error.message || 'An unexpected error occurred.'}`);
            } finally {
                deleting = false;
            }
        }
    }
</script>

<div class="card bg-base-100 shadow-xl p-6">
    <figure>
        {#if recipe.imageUrl}
            <img src={recipe.imageUrl} alt={recipe.title} class="rounded-box w-full max-h-80 object-cover mb-4" />
        {:else}
            <div class="bg-gray-200 w-full h-48 rounded-box flex items-center justify-center mb-4">
                <span class="text-gray-500">No Image</span>
            </div>
        {/if}
    </figure>
    <div class="card-body p-0">
        <h1 class="card-title text-3xl font-bold mb-2">{recipe.title}</h1>
        <p class="text-gray-700 text-lg mb-4">{recipe.description}</p>

        <div class="flex flex-wrap gap-2 mb-6">
            {#if recipe.category}
                <div class="badge badge-lg badge-primary">{recipe.category}</div>
            {/if}
            {#if recipe.cuisine}
                <div class="badge badge-lg badge-secondary">{recipe.cuisine}</div>
            {/if}
            {#if recipe.prepTime}
                <div class="badge badge-lg badge-outline">Prep: {recipe.prepTime}</div>
            {/if}
            {#if recipe.cookTime}
                <div class="badge badge-lg badge-outline">Cook: {recipe.cookTime}</div>
            {/if}
            {#if recipe.servings}
                <div class="badge badge-lg badge-outline">Servings: {recipe.servings}</div>
            {/if}
        </div>

        <div class="prose max-w-none mb-6">
            <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul class="list-disc list-inside">
                {#if recipe.ingredients}
                    {#each recipe.ingredients.split(',').map(s => s.trim()) as ingredient}
                        <li>{ingredient}</li>
                    {/each}
                {/if}
            </ul>

            <h2 class="text-2xl font-semibold mt-6 mb-2">Instructions</h2>
            <ol class="list-decimal list-inside">
                {#if recipe.instructions}
                    {#each recipe.instructions.split('.').map(s => s.trim()).filter(Boolean) as instruction}
                        <li>{instruction}</li>
                    {/each}
                {/if}
            </ol>
        </div>

        <div class="text-sm text-gray-500 mt-auto">
            {#if recipe.createdAt}
                <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            {/if}
            {#if recipe.updatedAt}
                <p>Last Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
            {/if}
        </div>

        <div class="mt-6 flex justify-end gap-2">
            <a href={`/recipes/edit/${recipe.id}`} class="btn btn-warning">Edit Recipe</a>
            <button on:click={handleDelete} class="btn btn-error" disabled={deleting}>
                {#if deleting}
                    <span class="loading loading-spinner"></span>
                    Deleting...
                {:else}
                    Delete Recipe
                {/if}
            </button>
        </div>
    </div>
</div>