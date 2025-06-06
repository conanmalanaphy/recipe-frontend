<script lang="ts">
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
        createdAt: string;
        updatedAt: string;
    };
</script>

<div class="card bg-base-100 shadow-xl p-6"> <figure>
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
                <div class="badge badge-lg badge-primary">{recipe.category}</div> {/if}
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

        <div class="prose max-w-none mb-6"> <h2 class="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul class="list-disc list-inside">
                {#each recipe.ingredients.split(',').map(s => s.trim()) as ingredient}
                    <li>{ingredient}</li>
                {/each}
            </ul>

            <h2 class="text-2xl font-semibold mt-6 mb-2">Instructions</h2>
            <ol class="list-decimal list-inside">
                {#each recipe.instructions.split('.').map(s => s.trim()).filter(Boolean) as instruction}
                    <li>{instruction}</li>
                {/each}
            </ol>
        </div>

        <div class="text-sm text-gray-500 mt-auto">
            <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
        </div>
    </div>
</div>