<template>
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
    <div class="flex p-4 rounded-lg bg-white shadow-md">
      <div class="w-8/12 md:w-10/12 flex flex-col gap-2">
        <div class="w-full flex flex-col border-b">
          <span class="text-lg">Customer Groups</span>
          <span class="text-sm text-gray-400">Most customers</span>
        </div>
        <table class="table">
          <tr>
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>Customer Group 1</td>
            <td class="font-semibold">4000</td>
          </tr>
          <tr>
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>Customer Group 1</td>
            <td class="font-semibold">3800</td>
          </tr>
          <tr>
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>Customer Group 1</td>
            <td class="font-semibold">3650</td>
          </tr>
          <tr>
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>Customer Group 1</td>
            <td class="font-semibold">3500</td>
          </tr>
          <tr>
            <td>
              <img src="~/assets/images/angliss.svg" alt="" />
            </td>
            <td>Customer Group 1</td>
            <td class="font-semibold">3400</td>
          </tr>
        </table>
      </div>
      <div class="w-4/12 md:w-2/12 flex flex-col justify-start">
        <img src="~/assets/images/rocket.svg" alt="" />
      </div>
    </div>
    <div class="flex p-4 rounded-lg bg-primary text-white shadow-md">
      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex border-b">
          <div class="w-9/12 flex flex-col">
            <span class="text-lg">Top 5 Tags</span>
            <span class="text-sm">Customer Count</span>
          </div>
          <div class="w-3/12 flex items-center">
            <img src="~/assets/images/star.svg" alt="" />
          </div>
        </div>

        <table class="table">
          <tr>
            <td>VIP</td>
            <td class="font-semibold">1500</td>
          </tr>
          <tr>
            <td>GOLD</td>
            <td class="font-semibold">1400</td>
          </tr>
          <tr>
            <td>SILVER</td>
            <td class="font-semibold">1400</td>
          </tr>
          <tr>
            <td>STANDARD</td>
            <td class="font-semibold">1400</td>
          </tr>
          <tr>
            <td>BRONZE</td>
            <td class="font-semibold">1400</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
