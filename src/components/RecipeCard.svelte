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

<a href={`/recipes/${recipe.id}`} class="block bg-white rounded-lg shadow-md p-6 flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer">
    <h2 class="text-2xl font-semibold text-gray-800 mb-2">{recipe.title}</h2>
    <p class="text-gray-600 mb-4 flex-grow">{recipe.description}</p>
    <div class="mt-auto">
        {#if recipe.category}
            <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{recipe.category}</span>
        {/if}
        {#if recipe.cuisine}
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{recipe.cuisine}</span>
        {/if}
    </div>
</a>