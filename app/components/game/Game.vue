<script setup lang="ts">
const props = defineProps<{
  countries: Country[]
}>()

const emit = defineEmits<{
  back: []
}>()

const { countries } = toRefs(props)

const { choices, selectChoice, currentQuestion } = useGame(countries.value)

function handleExit(): void {
  emit('back')
}

// FIXME: Show hint for territories that have the same flag as country
// FIXME: Alt text of images shouldn't have the name of the country in it
// TODO: Stop timer at 60m & after 5m of inactivity pause
// TODO: Setup choices pool to have closely related options
</script>

<template>
  <div>
    <div v-if="currentQuestion">
      <Transition name="slide-side" mode="out-in" appear>
        <GameImage
          :key="currentQuestion.cca3"
          :src="currentQuestion.flag.svg"
          :alt="currentQuestion.flag.alt"
        />
      </Transition>

      <Transition name="slide-up" mode="out-in" appear>
        <div :key="`choices-${currentQuestion.cca3}`" class="grid grid-cols-2 items-stretch gap-4">
          <div
            v-for="choice in choices" :key="choice.country.cca3" class="relative"
            :class="{
              'choice-wiggle': choice.showOverlay.value && !choice.isCorrect,
              'choice-pop': choice.showOverlay.value && choice.isCorrect,
            }"
          >
            <BaseCardButton
              :label="choice.country.name.common"
              @click="selectChoice(choice)"
            />

            <Transition name="fade">
              <div
                v-if="choice.showOverlay.value"
                class="absolute inset-0 z-10 flex items-center justify-center rounded-lg text-inverted pointer-events-none"
                :class="choice.isCorrect ? 'bg-success' : 'bg-error'"
              >
                <UIcon :name="choice.isCorrect ? 'i-tabler-check' : 'i-tabler-x'" class="size-10" />
              </div>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  <!-- <section class="space-y-4"> -->
  <!--   <Transition name="fade" mode="out-in"> -->
  <!--     <GameHeader -->
  <!--       v-if="gameSession.viewState !== 'completed'" -->
  <!--       v-model:paused="gameSession.isPaused" -->
  <!--       :session -->
  <!--     /> -->
  <!--   </Transition> -->
  <!---->
  <!--   <Transition name="fade" mode="out-in"> -->
  <!--     <GamePause -->
  <!--       v-if="gameSession.viewState === 'paused'" -->
  <!--       key="paused" -->
  <!--       @resume="gameSession.resume" -->
  <!--       @exit="handleExit" -->
  <!--     /> -->
  <!---->
  <!--     <GameEndCard -->
  <!--       v-else-if="gameSession.viewState === 'completed' && gameSession.runResult" -->
  <!--       key="completed" -->
  <!--       :result="gameSession.runResult" -->
  <!--       @retry="gameSession.retry" -->
  <!--       @back="handleExit" -->
  <!--     /> -->
  <!---->
  <!--     <div -->
  <!--       v-else-if="gameSession.currentQuestion" -->
  <!--       key="playing" -->
  <!--       class="space-y-12" -->
  <!--     > -->
  <!--       <div class="space-y-4 max-w-2xl mx-auto"> -->
  <!--         <Transition name="slide-side" mode="out-in" appear> -->
  <!--           <GameImage -->
  <!--             :key="gameSession.currentQuestion.cca2" -->
  <!--             :src="gameSession.currentQuestion.flag.svg" -->
  <!--             :alt="gameSession.currentQuestion.flag.alt" -->
  <!--             :preload-src="gameSession.nextQuestion?.flag.svg" -->
  <!--           /> -->
  <!--         </Transition> -->
  <!---->
  <!--         <Transition name="slide-up" mode="out-in" appear> -->
  <!--           <div :key="`choices-${gameSession.currentQuestion.cca2}`" class="grid grid-cols-2 items-stretch gap-4"> -->
  <!--             <div -->
  <!--               v-for="choice in gameSession.choices" -->
  <!--               :key="choice.cca2" -->
  <!--               class="relative" -->
  <!--               :class="{ -->
  <!--                 'choice-wiggle': gameSession.showErrorOverlay(choice), -->
  <!--                 'choice-pop': gameSession.showSuccessOverlay(choice), -->
  <!--               }" -->
  <!--             > -->
  <!--               <BaseCardButton -->
  <!--                 :label="choice.name.common" -->
  <!--                 :disabled="gameSession.isRevealed" -->
  <!--                 @click="gameSession.selectChoice(choice)" -->
  <!--               /> -->
  <!---->
  <!--               <Transition name="fade"> -->
  <!--                 <div -->
  <!--                   v-if="gameSession.showSuccessOverlay(choice)" -->
  <!--                   class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-success text-inverted pointer-events-none" -->
  <!--                 > -->
  <!--                   <UIcon name="i-tabler-check" class="size-10" /> -->
  <!--                 </div> -->
  <!---->
  <!--                 <div -->
  <!--                   v-else-if="gameSession.showErrorOverlay(choice)" -->
  <!--                   class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-error text-inverted pointer-events-none" -->
  <!--                 > -->
  <!--                   <UIcon name="i-tabler-x" class="size-10" /> -->
  <!--                 </div> -->
  <!--               </Transition> -->
  <!--             </div> -->
  <!--           </div> -->
  <!--         </Transition> -->
  <!--       </div> -->
  <!--     </div> -->
  <!--   </Transition> -->
  <!-- </section> -->
  </div>
</template>
