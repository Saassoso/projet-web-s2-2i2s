const axios = require('axios');

exports.getPrediction = async (req, res) => {
  const { homeTeam, awayTeam } = req.query;
  
  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ msg: 'Both homeTeam and awayTeam are required' });
  }

  try {
    const prompt = `Give me a simple prediction for this football match: ${homeTeam} vs ${awayTeam}. 
    Return ONLY a JSON object with this exact format:
    {
      "homeWin": 45,
      "draw": 25, 
      "awayWin": 30,
      "confidence": "medium",
      "reason": "brief reason"
    }
    Numbers should add up to 100. No other text.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // Try to parse JSON from AI response
    let prediction;
    try {
      // Remove any markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      prediction = JSON.parse(cleanResponse);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      prediction = {
        homeWin: 40,
        draw: 30,
        awayWin: 30,
        confidence: "low",
        reason: "AI response parsing failed"
      };
    }

    res.json({
      homeTeam,
      awayTeam,
      prediction
    });

  } catch (error) {
    console.error('Prediction error:', error.message);
    res.status(500).json({ msg: 'Failed to get prediction' });
  }
};