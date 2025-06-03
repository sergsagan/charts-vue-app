import { ref, onMounted } from 'vue';

export function useElectricityData() {
    const electricity = ref<Record<number, { month: string; amount: number }[]>>({});
    const isLoading = ref(true);

    const loadData = async () => {
        try {
            const res = await fetch('/api-electricity.json');
            electricity.value = await res.json();
        } catch (error) {
            console.error('Failed to load electricity data:', error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(loadData);

    return {
        electricity,
        isLoading
    };
}
