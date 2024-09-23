import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useConnect = () => {
  const queryClient = useQueryClient(); // Corrected name here
  const { mutate: connect, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/follow/${userId}`, { // Corrected userId
          method: 'POST',
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
        return;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => { // Added async here
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] })
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { connect, isPending };
};

export default useConnect;
