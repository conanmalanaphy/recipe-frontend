<script lang="ts">
    import { onMount } from 'svelte'; // Svelte lifecycle hook
    import RecipeCard from './RecipeCard.svelte'; // Import the RecipeCard component

    const API_URL = 'https://recipe-backend-3ata.onrender.com/api/recipes';

    let recipes: any[] = []; // Array to hold fetched recipes
    let isLoading: boolean = true;
    let errorMessage: string = '';

    onMount(async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            recipes = await response.json(); // Update the recipes array
        } catch (error: any) {
            console.error("Failed to fetch recipes:", error);
            errorMessage = error.message || "Failed to load recipes. Please try again.";
        } finally {
            isLoading = false;
        }
    });
</script>

{#if errorMessage}
    <p class="text-red-500 text-center mb-4">{errorMessage}</p>
{:else if isLoading}
    <div class="flex justify-center items-center h-48">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="ml-4 text-gray-600">Loading recipes...</p>
    </div>
{:else if recipes.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each recipes as recipe (recipe.id)}
            <RecipeCard {recipe} />
        {/each}
    </div>
{:else}
    <p class="text-center text-gray-600">No recipes found. Add some!</p>
{/if}